"use server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { OrderTypes } from "@/config";

export async function getAnswer(order: string, elementIds: string[]) {
  const elementIdsString = elementIds.join(",");
  const { THEME, MOVE, RESIZE, CLICK } = OrderTypes;

  const { object, finishReason, usage } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      action: z.enum([THEME, MOVE, RESIZE, CLICK]),
      elementId: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (value) {
              return elementIds.includes(value);
            }
            return true;
          },
          {
            message: "Element ID is not valid",
            path: ["elementId"],
          },
        ),
      parameter: z.object({
        theme: z.string().optional(),
        direction: z.string().optional(),
        x: z.number().optional(),
        y: z.number().optional(),
        size: z.string().optional(),
      }),
    }),
    system: `Eres un asistente que devuelve los valores de claves que interactuan con la UI
    * Si te piden cambiar el tema de la aplicacion puedes responder con la acción '${THEME}' y el parametro de tema con el valor: light, dark, system. 
    * Si te piden mover un elemento, puedes responder con la acción '${MOVE}', el id del elemento y la dirección: up, down, left, right, center.
    * Si en la accion '${MOVE}' se pide mover un elemento a una posición específica, puedes responder con la acción '${MOVE}', el id del elemento y las coordenadas x, y.
    * Si te piden redimensionar un elemento, puedes responder con la acción '${RESIZE}', el id del elemento y el tamaño: sm, md, lg, xl. 
    * El usuario puede dar ordenes no tan especificas como apaga las luces, o enciende las luces o Lumos Máxima, etc`,
    prompt: `${order}. 
    * Los ids de los elementos disponibles son: ${elementIdsString}.
    * Las acciones disponibles son: ${THEME}, ${MOVE}, ${RESIZE}, ${CLICK}.
    * Los parametros disponibles son: theme, direction, x, y, size.
    * Los valores del parametro theme son: light, dark, system.
    * Los valores del parametro direction son: up, down, left, right, center, up-left, up-right, down-left, down-right.
    * Los valores del parametro size son: sm, md, lg, xl.`,
  });

  return { object, finishReason, usage };
}
