import React from "react";

export function FooterInfo() {
  return (
    <div className="mt-8 text-center">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          معلومات مهمة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <strong>ساعات العمل:</strong>
            <br />
            الاثنين-الجمعة: 8:00 ص - 6:00 م
            <br />
            السبت: 9:00 ص - 2:00 م
          </div>
          <div>
            <strong>الطوارئ:</strong>
            <br />
            للحالات العاجلة، اتصل على
            <br />
            (555) 123-4567
          </div>
          <div>
            <strong>التأكيد:</strong>
            <br />
            سنتصل بك خلال 24 ساعة
            <br />
            لتأكيد موعدك
          </div>
        </div>
      </div>
    </div>
  );
}
