"use server";

// ↑ Marcar que todas las funciones que se exportan en este archivo son de servidor y por lo tanto no se ejecuta ni se envían al cliente.

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Invoice } from "./definitions";

const CreateInvoiceSchema = z.object({
   id: z.string(),
   customerId: z.string(),
   amount: z.coerce.number(),
   status: z.enum(["pending", "paid"]),
   date: z.string(),
});

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({
   id: true,
   date: true,
});

export async function createInvoice(formData: FormData) {
   const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
   });

   // Transformamos para evitar errores de redondeo
   const amountInCents = amount * 100;
   // Creamos la fecha actual "2026-05-20T23:05:14.332Z"
   const date = new Date().toISOString();

   // Acá esta función por dentro valida y sanitiza y tiene seguridad para inyección de código.
   await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

   // Luego de enviar los datos hay que revalidar la ruta en la que aparecen estos datos para que se puedan ver los nuevo datos y no se quede con el caché.
   revalidatePath("/dashboard/invoices");
   redirect("/dashboard/invoices");
   //    console.log("createInvoice", rawFormData);
}
