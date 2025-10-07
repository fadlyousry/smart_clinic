import { Frown } from "lucide-react";

const EmptyState = () => {
    return (
        <div className="p-12 text-center">
            <Frown className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد مواعيد</h3>
            <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مواعيد تطابق معايير البحث.</p>
        </div>
    );
};

export default EmptyState;