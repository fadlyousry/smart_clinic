const LoadingOverlay = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <p>جاري حفظ البيانات...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;