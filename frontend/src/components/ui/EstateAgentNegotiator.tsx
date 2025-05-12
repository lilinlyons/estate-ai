// EstateAgentNegotiator.tsx
"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker";
import { FileUploader } from "@/components/ui/file-uploader";

export default function EstateAgentNegotiator() {
    const [surveyFile, setSurveyFile] = useState<File | null>(null);
    const [address, setAddress] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [surveyDate, setSurveyDate] = useState<Date | undefined>();
    const [buyerConcerns, setBuyerConcerns] = useState('');
    const [reductionAmount, setReductionAmount] = useState('');
    const [requestWork, setRequestWork] = useState(false);
    const [agentNotes, setAgentNotes] = useState('');

    const handleGenerate = async () => {
        if (!surveyFile) {
            alert("Please upload a survey file.");
            return;
        }

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
            alert("Successfully uploaded file.");
            if (!data.result) throw new Error("Empty response from backend");

            const blob = new Blob([data.result], { type: "text/plain;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "property-summary.txt");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate report");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Post-Survey Negotiation Assistant</h1>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <Label>Upload Survey File (PDF/DOCX)</Label>
                    <FileUploader onFileSelect={setSurveyFile} fileName={surveyFile?.name} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <Label>Property Address</Label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} />

                    <Label>Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Flat">Flat</SelectItem>
                            <SelectItem value="Terrace">Terrace</SelectItem>
                            <SelectItem value="Semi-detached">Semi-detached</SelectItem>
                            <SelectItem value="Detached">Detached</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label>Date of Survey</Label>
                    <DatePicker date={surveyDate} onDateChange={setSurveyDate} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <Label>Buyer Concerns</Label>
                    <Textarea value={buyerConcerns} onChange={e => setBuyerConcerns(e.target.value)} />

                    <Label>Reduction Request (£ or %)</Label>
                    <Input type="text" value={reductionAmount} onChange={e => setReductionAmount(e.target.value)} />

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={requestWork} onChange={e => setRequestWork(e.target.checked)} />
                        <span>Buyer requesting work instead of reduction</span>
                    </label>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <Label>Agent Notes (Optional)</Label>
                    <Textarea value={agentNotes} onChange={e => setAgentNotes(e.target.value)} />
                </CardContent>
            </Card>

            <Button className="w-full text-lg" onClick={handleGenerate}>Generate Report</Button>
            <footer>Disclaimer:
                By using this tool, you acknowledge that the property address and any names you provide may be processed by OpenAI's ChatGPT API to generate report content. No personal data is stored beyond what is necessary for report generation.</footer>
        </div>
    );
}
