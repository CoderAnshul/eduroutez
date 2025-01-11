import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Send, Loader2, MessageCircle, Clock, Tag, School } from 'lucide-react';
import axiosInstance from '../ApiFunctions/axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from "react-toastify";

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-5 bg-gray-50 border-b border-gray-200 rounded-t-xl">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-5">{children}</div>
);

const CombinedQuestionsPage = () => {
  const [formData, setFormData] = useState({ question: '', grade: '', label: '' });

  const grades = ['8th', '9th', '10th', '11th', '12th'];
  const labels = ['Academic', 'Career', 'College', 'Personal'];
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const userEmail = Cookies.get('email') || 'user@example.com';

  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await axiosInstance.get(`${apiUrl}/question-answers`);
      const sortedQuestions = response.data.data.result.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sortedQuestions.slice(0, 5); 
    },
  });
  

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(`${apiUrl}/question-answer`
        , {
    
        ...formData,
        askedBy: userEmail,

      },{withCredentials:true});
      return response.data;
    },
    onSuccess: () => {
        toast.success("Question Submitted successfully!");
        document.getElementById('questionForm').reset();
      setFormData({ question: '', grade: '', label: '' });
      refetch();
    },
    onError: () => {
      alert('An error occurred. Please try again.');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

return (
    <div className="max-w-8xl mx-auto p-4 md:p-6">
        <ToastContainer />
        <div className="mb-4">
            <button
                onClick={() => window.history.back()}
                className="`w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                &larr; Back to Dashboard
            </button>
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Student Q&A Hub
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-gray-800">Ask a Question</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Get guidance from experts and peers!
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form id="questionForm" onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Question
                                </label>
                                <textarea
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Type your question..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grade
                                    </label>
                                    <select
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select grade...</option>
                                        {grades.map((grade) => (
                                            <option key={grade} value={grade}>
                                                {grade}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="label"
                                        value={formData.label}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select category...</option>
                                        {labels.map((label) => (
                                            <option key={label} value={label}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Question
                                    </>
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:w-2/3">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-4">
                        Failed to load questions. Please try again later.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions?.map((question) => (
                            <Card key={question.id} className="hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <h3 className="text-lg font-bold text-gray-800">{question.question}</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <School className="h-4 w-4" />
                                                <span>{question.grade}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Tag className="h-4 w-4" />
                                                <span>{question.label}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatDate(question.createdAt)}</span>
                                            </div>
                                        </div>
                                        {question.answer ? (
                                            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
                                                <p className="text-sm text-gray-700">{question.answer}</p>
                                            </div>
                                        ) : (
                                            <div className="italic text-gray-500">No answer yet</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {questions?.length === 0 && (
                            <div className="text-center py-12">
                                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-800">No Questions Yet</h3>
                                <p className="text-gray-600">Be the first to ask a question!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default CombinedQuestionsPage;
