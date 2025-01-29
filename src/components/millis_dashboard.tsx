import React, { useState, useEffect } from 'react';
import { Clock, User, MessageCircle, Headphones } from 'lucide-react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaClock, FaRupeeSign } from 'react-icons/fa';

// TypeScript Interfaces
interface CostBreakdown {
    credit: number;
    provider: string;
    type: string;
}

interface Recording {
    recording_url: string;
}

interface AgentConfig {
    language: string;
    call_settings: {
        enable_recording: boolean;
    };
    first_message: string;
    flow: {
        agent_terminate_call: {
            enabled: boolean;
        };
        user_start_first: boolean;
    };
    llm: {
        model: string;
        temperature: number;
    };
    prompt: string;
    speech_to_text: {
        multilingual: boolean;
        provider: string;
    };
    switch_language: {
        languages: string[];
    };
    voice: {
        model: string;
        provider: string;
        voice_id: string;
    };
}

interface CallHistoryItem {
    agent_id: string;
    call_status: string;
    chars_used: number;
    chat: Array<{ role: string; content: string }> | null;
    cost_breakdown: CostBreakdown[] | null;
    duration: number;
    recording: Recording;
    session_id: string;
    ts: number;
    agent_config: AgentConfig;
}

interface CallHistoryResponse {
    items: CallHistoryItem[];
    has_histories: boolean;
    summary: {
        total_calls: number;
        successful_calls: number;
        failed_calls: number;
        total_duration_minutes: number;
        total_cost_inr: number;
    };
}

const MillisDashboard: React.FC = () => {
    const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<{
        total_calls: number;
        successful_calls: number;
        failed_calls: number;
        total_duration_minutes: number;
        total_cost_inr: number;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6);

    useEffect(() => {
        const fetchCallHistory = async () => {
            try {
                const response = await axios.get<CallHistoryResponse>(
                    'https://api.maitriai.com/ai_assistant/api/agents/-OH7E9K8sf2MA3lk9d8y/call-histories',
                    {
                        params: { limit: 20, page: currentPage },
                        headers: { accept: 'application/json' },
                    }
                );

                if (response.data.has_histories) {
                    setCallHistory(response.data.items);
                    setSummary(response.data.summary);
                    setTotalPages(Math.ceil(response.data.summary.total_calls / 20)); // Assuming 20 calls per page
                } else {
                    setError('No call histories found.');
                }
            } catch (err: any) {
                setError(`Error fetching data: ${err.response ? err.response.data : err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCallHistory();
    }, [currentPage]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500 text-white';
            case 'in progress':
                return 'bg-yellow-500 text-white';
            case 'failed':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-300 text-gray-800';
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 max-w-lg mx-auto rounded-lg shadow-md">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">Call History Dashboard</h1>
                <div className="flex space-x-4">
                    <Link
                        to="https://docs.google.com/spreadsheets/d/1ZspfBJdtxdERti7KNhqEM-4m3D9Z2i2uslSxtiUiM1U/edit?pli=1&gid=0#gid=0"
                        className="py-2 px-4 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                    >
                        Appointment
                    </Link>
                    <Link
                        to="https://docs.google.com/spreadsheets/d/1mU4j8cfte4ZamNLC89CrGsARS54dTD52srC6fedUzdw/edit?gid=0#gid=0"
                        className="py-2 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        Upload Data
                    </Link>
                    <Link
                        to="https://docs.google.com/spreadsheets/d/1mU4j8cfte4ZamNLC89CrGsARS54dTD52srC6fedUzdw/edit?gid=0#gid=0"
                        className="py-2 px-4 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
                    >
                        Show All Inbound Calls
                    </Link>
                </div>
            </div>

            {/* Total Summary Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                    <FaPhoneAlt className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Total Calls</h2>
                        <p className="text-2xl font-bold text-gray-900">{summary?.total_calls}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                    <FaClock className="text-green-500 text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Total Duration</h2>
                        <p className="text-2xl font-bold text-gray-900">{summary?.total_duration_minutes.toFixed(2)} minutes</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                    <FaRupeeSign className="text-yellow-500 text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Overall Cost</h2>
                        <p className="text-2xl font-bold text-gray-900">₹{summary?.total_cost_inr.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {callHistory.length === 0 ? (
                <div className="text-center text-gray-500">No call history found.</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {callHistory.map((call, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">Call #{index + 1}</h2>
                                <span className={`${getStatusColor(call.call_status)} px-3 py-1 rounded-full text-xs`}>{call.call_status}</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <span><strong>Agent ID:</strong> {call.agent_id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <span><strong>Duration:</strong> {call.duration ? `${call.duration.toFixed(2)} seconds` : 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MessageCircle className="h-5 w-5 text-gray-500" />
                                    <span><strong>Characters Used:</strong> {call.chars_used || 'N/A'}</span>
                                </div>
                                {/* <div className="flex items-start space-x-2">
                                    <CreditCard className="h-5 w-5 text-gray-500" />
                                    <details className="w-full">
                                        <summary className="cursor-pointer font-semibold text-gray-700">Cost Breakdown</summary>
                                        {call.cost_breakdown && call.cost_breakdown.length > 0 ? (
                                            <ul className="pl-6 text-sm text-gray-600 mt-2">
                                                {call.cost_breakdown.map((cost, idx) => (
                                                    <li key={idx}>{cost.provider}: {cost.credit} ({cost.type})</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No cost details available</p>
                                        )}
                                    </details>
                                </div> */}
                                {call.recording?.recording_url && (
                                    <div className="flex items-center space-x-2">
                                        <Headphones className="h-5 w-5 text-gray-500" />
                                        <audio controls className="w-full mt-2" src={call.recording.recording_url}>
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
                <button
                    className="py-2 px-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                    className="py-2 px-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MillisDashboard;
