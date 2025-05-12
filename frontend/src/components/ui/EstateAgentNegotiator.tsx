"use client";
import React, { useState } from "react";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Button
} from "@/components/ui/button";
import {
    Input
} from "@/components/ui/input";
import {
    Textarea
} from "@/components/ui/textarea";
import {
    Label
} from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    DatePicker
} from "@/components/ui/datepicker";
import {
    FileUploader
} from "@/components/ui/file-uploader";
import jsPDF from "jspdf";

export default function EstateAgentNegotiator() {
    const [surveyFile, setSurveyFile] = useState < File | null > (null);
    const [address, setAddress] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [surveyDate, setSurveyDate] = useState < Date | undefined > ();
    const [buyerConcerns, setBuyerConcerns] = useState("");
    const [reductionAmount, setReductionAmount] = useState("");
    const [requestWork, setRequestWork] = useState(false);
    const [agentNotes, setAgentNotes] = useState("");
    const [loading, setLoading] = useState(false);


    const handleGenerate = async () => {
        if (!surveyFile) {
            alert("Please upload a survey file.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", surveyFile);
        formData.append("address", address);
        formData.append("propertyType", propertyType);
        formData.append("buyerConcerns", buyerConcerns);
        formData.append("reductionAmount", reductionAmount);
        formData.append("agentNotes", agentNotes);

        try {
            const response = await fetch("http://localhost:3001/api/generate", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.result) throw new Error("Empty response from backend");

            const doc = new jsPDF();
            let y = 20;

            // Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Post-Survey Negotiation Report", 20, y);
            y += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(100);

            // Property Details
            doc.setFontSize(13);
            doc.setTextColor(0);
            doc.setFont("helvetica", "bold");
            doc.text("Property Details", 20, (y += 12));
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50);
            doc.text(`Address: ${address}`, 20, (y += 8));
            doc.text(`Type: ${propertyType}`, 20, (y += 8));
            doc.text(`Survey Date: ${surveyDate?.toLocaleDateString() || "N/A"}`, 20, (y += 8));

            // Survey Summary
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text("Survey Summary", 20, (y += 12));
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50);
            const summaryLines = doc.splitTextToSize(data.result, 170);
            doc.text(summaryLines, 20, (y += 8));
            y += summaryLines.length * 7;

            // Buyer Concerns
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text("Buyer Concerns", 20, (y += 12));
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50);
            const concernsLines = doc.splitTextToSize(buyerConcerns || "N/A", 170);
            doc.text(concernsLines, 20, (y += 8));
            y += concernsLines.length * 7;

            // Reduction Request
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text("Reduction Request", 20, (y += 12));
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50);
            doc.text(reductionAmount || "N/A", 20, (y += 8));
            y += 8;

            // Request Work
            if (requestWork) {
                doc.setFont("helvetica", "italic");
                doc.setTextColor(80);
                doc.text("(Buyer prefers remedial work instead of monetary reduction)", 20, (y += 6));
            }

            // Agent Notes
            if (agentNotes) {
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0);
                doc.text("Agent Notes", 20, (y += 12));
                doc.setFont("helvetica", "normal");
                doc.setTextColor(50);
                const notesLines = doc.splitTextToSize(agentNotes, 170);
                doc.text(notesLines, 20, (y += 8));
                y += notesLines.length * 7;
            }

            // Footer
            if (y > 270) doc.addPage(); // Add page if near bottom

            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(
                "Generated with the Post-Survey Assistant Tool | For internal use only",
                20,
                290
            );

            doc.save("property-summary.pdf");
            alert("PDF generated successfully.");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 py-10 px-4"
        >
            <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-xl max-w-4xl mx-auto p-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🏡 Post-Survey Negotiation Assistant</h1>
                    <p className="text-gray-600">Create clear, persuasive post-survey summaries for buyers and sellers.</p>
                </div>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <Label className="text-base font-medium">Upload Survey Report (PDF/DOCX)</Label>
                        <FileUploader onFileSelect={setSurveyFile} fileName={surveyFile?.name} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <Label className="text-base font-medium">Property Details</Label>
                        <Input placeholder="Enter property address" value={address} onChange={e => setAddress(e.target.value)} />

                        <Label>Property Type</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose property type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Flat">Flat</SelectItem>
                                <SelectItem value="Terrace">Terrace</SelectItem>
                                <SelectItem value="Semi-detached">Semi-detached</SelectItem>
                                <SelectItem value="Detached">Detached</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Survey Date</Label>
                        <DatePicker date={surveyDate} onDateChange={setSurveyDate} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <Label className="text-base font-medium">Buyer Concerns</Label>
                        <Textarea value={buyerConcerns} onChange={e => setBuyerConcerns(e.target.value)} />

                        <Label>Reduction Request (£ or %)</Label>
                        <Input type="text" placeholder="e.g. £5,000 or 3%" value={reductionAmount} onChange={e => setReductionAmount(e.target.value)} />

                        <label className="flex items-center space-x-2 pt-2">
                            <input type="checkbox" checked={requestWork} onChange={e => setRequestWork(e.target.checked)} />
                            <span>Buyer prefers remedial work instead of reduction</span>
                        </label>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <Label className="text-base font-medium">Agent Notes (Optional)</Label>
                        <Textarea value={agentNotes} onChange={e => setAgentNotes(e.target.value)} />
                    </CardContent>
                </Card>

                <div className="relative">
                    <Button className="w-full text-lg" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate Negotiation Report"}
                    </Button>
                    {loading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg className="animate-spin h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        </div>
                    )}
                </div>

                <footer className="text-xs text-gray-500 pt-4 border-t border-gray-300">
                    <strong>Disclaimer:</strong> By using this tool, you agree that the property address and relevant inputs may be processed using AI to generate summaries.
                </footer>
            </div>
        </div>
    );
}
