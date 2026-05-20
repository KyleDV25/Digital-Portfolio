"use client";

import { useMemo } from "react";
import { MarkdownImage } from "./MarkdownImage";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({ content, className = "" }: Props) {
  const processedContent = useMemo(() => {
    if (!content) return "";

    // Split content by image tags
    const parts = content.split(/(<img[^>]*>)/g);

    return parts.map((part, index) => {
      // Check if this part is an img tag
      const imgMatch = part.match(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/);

      if (imgMatch) {
        const src = imgMatch[1];
        const alt = imgMatch[2] || "Image";
        return <MarkdownImage key={`img-${index}`} src={src} alt={alt} />;
      }

      // Return regular HTML
      return <div key={`text-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  }, [content]);

  return (
    <div className={`prose-punk ${className}`}>
      {processedContent}
    </div>
  );
}
