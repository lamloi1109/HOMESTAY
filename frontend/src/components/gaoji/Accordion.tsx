import React, { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details
      className="group rounded-none border-b border-jade/20 overflow-hidden open:pb-4 transition-all duration-300"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium text-jade hover:text-clay transition-colors">
        <h3 className="text-[17px] font-sans font-semibold tracking-tight">{title}</h3>
        <span className="transition-transform duration-300 group-open:rotate-180 text-jade/60 group-hover:text-clay">
          <ChevronDown size={20} />
        </span>
      </summary>
      <div className="text-jade/70 leading-relaxed text-[15px] animate-in fade-in slide-in-from-top-2">
        {children}
      </div>
    </details>
  );
}
