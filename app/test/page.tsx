export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">
        Test Page - Tailwind CSS Test
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-800 text-lg">
          If you can see this white box with rounded corners and shadow, Tailwind CSS is working.
        </p>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Test Button
        </button>
      </div>
    </div>
  );
} 