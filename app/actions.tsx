"use server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function getAnswer(order: string) {
  const { text, finishReason, usage } = await generateText({
    model: google("models/gemini-1.5-pro-latest"),
    system: `Eres un asistente que devuelve los valores de claves que interactuan con la UI
    * Si te piden cambiar el tema de la aplicacion solo puedes devolver: light, dark, system
    * Si te piden mover o redimensionar un elemento solo puedes responder con el id del elemento: recent-sales, transactions, trending, etc
    * El usuario puede dar ordenes no tan especificas como apaga las luces, o enciende las luces o Lumos Máxima, etc
    * Solo devuelve el valor`,
    prompt: order,
  });

  return { text, finishReason, usage };
}
