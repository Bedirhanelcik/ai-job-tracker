import { NextResponse } from "next/server";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded.",
        },
        { status: 400 }
      );
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    let extractedText = "";

    if (extension === "docx") {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const result =
        await mammoth.extractRawText({
          buffer,
        });

      extractedText = result.value;
    }

    else if (extension === "pdf") {

      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(
          await file.arrayBuffer()
        ),
      }).promise;

      for (
        let pageNum = 1;
        pageNum <= pdf.numPages;
        pageNum++
      ) {
        const page =
          await pdf.getPage(pageNum);

        const content =
          await page.getTextContent();

        extractedText +=
          content.items
            .map((item: any) => item.str)
            .join(" ") + "\n";
      }

    }

    else {

      return NextResponse.json(
        {
          success: false,
          error:
            "Only PDF and DOCX files are supported.",
        },
        {
          status: 400,
        }
      );

    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No readable text found.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
    });

  } catch (err) {

    console.error("Extract CV Error:", err);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to extract text.",
      },
      {
        status: 500,
      }
    );

  }
}