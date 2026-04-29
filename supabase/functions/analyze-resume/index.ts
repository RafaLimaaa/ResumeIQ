import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

interface RequestBody {
  resumeText: string
  jobDescription: string
  jobTitle: string
  companyName?: string
}

interface GeminiResult {
  overall_score: number
  experience_score: number
  skills_score: number
  education_score: number
  keywords_score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  summary: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    // Fail fast with a clear message if secrets are missing
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase env vars')
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incompleta (Supabase)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not set — run: supabase secrets set GEMINI_API_KEY=<key>')
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY não configurado no servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Resolve user from JWT if present (optional — anonymous requests are allowed)
    let userId: string | null = null
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (!error && user) userId = user.id
    }

    const body: RequestBody = await req.json()
    const { resumeText, jobDescription, jobTitle, companyName } = body

    if (!resumeText || !jobDescription || !jobTitle) {
      return new Response(
        JSON.stringify({ error: 'resumeText, jobDescription e jobTitle são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `Você é um especialista em recrutamento e análise de currículos.
Analise a compatibilidade entre o currículo e a vaga abaixo.
CURRÍCULO:
${resumeText}
DESCRIÇÃO DA VAGA:
${jobDescription}
Retorne APENAS um objeto JSON válido, sem markdown, sem explicações,
com exatamente esta estrutura:
{
"overall_score": number (0-100),
"experience_score": number (0-100),
"skills_score": number (0-100),
"education_score": number (0-100),
"keywords_score": number (0-100),
"strengths": string[] (máx 5 itens, frases curtas e concretas),
"gaps": string[] (máx 5 itens, frases curtas e concretas),
"suggestions": string[] (máx 5 sugestões acionáveis e específicas),
"summary": string (2-3 frases resumindo a compatibilidade geral)
}`

    console.log(`Calling Gemini model: ${GEMINI_MODEL}`)

    const geminiResponse = await fetch(`${GEMINI_URL}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text()
      // Log full Gemini error so it appears in Supabase Edge Function logs
      console.error(`Gemini ${geminiResponse.status} error:`, errBody)
      return new Response(
        JSON.stringify({
          error: 'Erro ao chamar Gemini API',
          // Include Gemini's own error message to simplify debugging
          detail: errBody,
          model: GEMINI_MODEL,
          httpStatus: geminiResponse.status,
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiData = await geminiResponse.json()
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    let result: GeminiResult
    try {
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse Gemini JSON. Raw response:', rawText)
      return new Response(
        JSON.stringify({ error: 'Resposta do Gemini inválida', raw: rawText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: analysis, error: insertError } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        job_title: jobTitle,
        company_name: companyName ?? null,
        overall_score: result.overall_score,
        experience_score: result.experience_score,
        skills_score: result.skills_score,
        education_score: result.education_score,
        keywords_score: result.keywords_score,
        strengths: result.strengths,
        gaps: result.gaps,
        suggestions: result.suggestions,
        raw_result: result,
      })
      .select()
      .single()

    if (insertError) {
      console.error('DB insert error:', insertError)
    }

    return new Response(
      JSON.stringify({ analysis, result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', detail: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
