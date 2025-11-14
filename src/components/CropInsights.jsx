import { useState } from 'react';
import { bloomAnalysis } from '../api/analytics';
import { chatbotAnalysis } from '../api/chatbot';
import TopBar from './TopBar';
import { Loader, TrendingUp, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

function CropInsights() {
  const [bloomData, setBloomData] = useState({
    ndvi: '',
    evi: '',
    probability: '',
    severity: '',
    flag: false
  });
  const [bloomResult, setBloomResult] = useState(null);
  const [bloomLoading, setBloomLoading] = useState(false);

  const [suggestionData, setSuggestionData] = useState({
    season: 'Kharif',
    soilType: 'Loamy',
    rainfall: '',
    temperature: ''
  });
  const [suggestions, setSuggestions] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const handleBloomAnalysis = async (e) => {
    e.preventDefault();
    setBloomLoading(true);
    try {
      const response = await bloomAnalysis(
        parseFloat(bloomData.ndvi),
        parseFloat(bloomData.evi),
        parseFloat(bloomData.probability),
        bloomData.severity,
        bloomData.flag
      );
      setBloomResult(response.analysis || response);
      toast.success('Bloom analysis completed');
    } catch (error) {
      toast.error('Failed to analyze bloom data');
    } finally {
      setBloomLoading(false);
    }
  };

  const handleCropSuggestions = async (e) => {
    e.preventDefault();
    setSuggestionLoading(true);
    try {
      const uid = localStorage.getItem('uid');
      const question = `Suggest best crops for my region with ${suggestionData.season} season, ${suggestionData.soilType} soil, ${suggestionData.rainfall}mm rainfall, and ${suggestionData.temperature}°C temperature. Provide crop names, expected yield, and confidence scores.`;

      const response = await chatbotAnalysis(uid, question);
      setSuggestions(response.reply_text || response.reply || 'No suggestions available');
      toast.success('Crop suggestions generated');
    } catch (error) {
      toast.error('Failed to get crop suggestions');
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Crop Insights" />

      <div className="ml-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Bloom Prediction</h2>
            </div>

            <form onSubmit={handleBloomAnalysis} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NDVI Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={bloomData.ndvi}
                  onChange={(e) => setBloomData({ ...bloomData, ndvi: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g., 0.65"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EVI Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={bloomData.evi}
                  onChange={(e) => setBloomData({ ...bloomData, evi: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g., 0.55"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bloomData.probability}
                  onChange={(e) => setBloomData({ ...bloomData, probability: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g., 75.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <select
                  value={bloomData.severity}
                  onChange={(e) => setBloomData({ ...bloomData, severity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bloomData.flag}
                  onChange={(e) => setBloomData({ ...bloomData, flag: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">Alert Flag Active</label>
              </div>

              <button
                type="submit"
                disabled={bloomLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bloomLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Bloom'
                )}
              </button>
            </form>

            {bloomResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">Analysis Result</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{bloomResult}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Crop Suggestions</h2>
            </div>

            <form onSubmit={handleCropSuggestions} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  value={suggestionData.season}
                  onChange={(e) => setSuggestionData({ ...suggestionData, season: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={suggestionData.soilType}
                  onChange={(e) => setSuggestionData({ ...suggestionData, soilType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                  <option value="Red">Red Soil</option>
                  <option value="Black">Black Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                <input
                  type="number"
                  value={suggestionData.rainfall}
                  onChange={(e) => setSuggestionData({ ...suggestionData, rainfall: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="e.g., 800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  value={suggestionData.temperature}
                  onChange={(e) => setSuggestionData({ ...suggestionData, temperature: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="e.g., 28"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={suggestionLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {suggestionLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Crop Suggestions'
                )}
              </button>
            </form>

            {suggestions && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-amber-800 mb-2">Recommendations</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{suggestions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropInsights;
