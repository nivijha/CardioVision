"""Gemini-powered chatbot endpoint with strict scope control."""

import asyncio
import logging

from fastapi import APIRouter, HTTPException

from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.schemas import ChatRequest

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/api/health-chat")
async def health_chat(req: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Gemini API key not configured on the server.")

    if not req.messages:
        raise HTTPException(status_code=400, detail="Messages array cannot be empty")

    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)

    if req.severity and req.severity.lower() not in ["none", "unknown"]:
        diagnosis_context = (
            f"The user has received a diagnosis corresponding to '{req.severity}' "
            f"coronary artery stenosis, with an estimated severity of {req.stenosis_percent}%."
        )
        scope_point_2 = f"Explaining their specific stenosis severity ('{req.severity}', {req.stenosis_percent}%)."
        scope_point_3 = "Offering safe, generalized lifestyle improvements to manage cardiovascular health (diet, exercise, stress, sleep)."
    else:
        diagnosis_context = "The user has not yet uploaded an image or received a diagnosis."
        scope_point_2 = "Explaining how stenosis severity is calculated by the app."
        scope_point_3 = "Offering general, safe cardiovascular lifestyle improvements."

    system_instruction = f"""You are CardioVision AI, a helpful and knowledgeable medical assistant.
{diagnosis_context}

Your SCOPE is strictly limited to:
1. Explaining what the CardioVision app does (analyzing angiography frames to detect stenosis).
2. {scope_point_2}
3. {scope_point_3}
4. Explaining how you (the AI) can help them.

If the user asks anything outside of this scope (e.g. unrelated topics, non-cardiovascular medical conditions, coding, general trivia), you MUST refuse to answer. Politely state that the question is out of your scope, and then list the permitted topics above so the user knows exactly what they can ask.
Always remind the user to consult a healthcare professional for personalized medical advice. Keep your answers concise and empathetic.
CRITICAL: Do NOT use any Markdown formatting like **bolding**, ## headers, or asterisk bullets (*). Provide your text as pure, clean, readable plain text with standard spacing and dashes (-) for lists."""

    try:
        model = genai.GenerativeModel(model_name=GEMINI_MODEL, system_instruction=system_instruction)

        history = []
        for msg in req.messages[:-1]:
            role = "user" if msg.role == "user" else "model"
            history.append({"role": role, "parts": [msg.content]})

        chat = model.start_chat(history=history)
        user_message = req.messages[-1].content
        response = await asyncio.to_thread(chat.send_message, user_message)
        return {"reply": response.text}
    except Exception as e:
        logger.error(f"Gemini API chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get AI response")
