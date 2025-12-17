"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { QuoteForm } from "@/components/landing/quote-form";

export function HeaderWrapper() {
    const [showQuoteForm, setShowQuoteForm] = useState(false);

    const handleGetQuote = () => {
        setShowQuoteForm(true);
    };

    return (
        <>
            <Navbar onGetQuote={handleGetQuote} />
            <QuoteForm isOpen={showQuoteForm} onClose={() => setShowQuoteForm(false)} />
        </>
    );
}
