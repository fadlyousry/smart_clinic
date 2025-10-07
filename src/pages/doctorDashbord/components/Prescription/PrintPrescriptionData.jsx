
export const printPrescriptionDirectly = (prescriptionData) => {
  const printWindow = window.open('', '_blank');
  
  const printContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>روشتة طبية - ${prescriptionData.patientName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
          background: #f9fafb;
          padding: 20px;
          color: #333;
          font-size: 14px;
          line-height: 1.5;
        }
        .prescription-container {
          max-width: 760px;
          margin: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
          padding: 24px;
          border: 2px solid #0891b2;
        }
        .header {
          border-bottom: 2px solid #0891b2;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .prescription-title {
          color: #155e75;
          font-size: 24px;
          font-weight: 700;
        }
        .prescription-date {
          background: #ecfeff;
          color: #155e75;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .doctor-info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #64748b;
        }
        .patient-info-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        .patient-info-title {
          font-weight: 600;
          color: #155e75;
          margin-bottom: 8px;
          font-size: 15px;
        }
        .patient-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 14px;
        }
        .patient-detail {
          display: flex;
        }
        .patient-detail-label {
          color: #64748b;
          margin-left: 4px;
        }
        .medications-section {
          margin-bottom: 20px;
        }
        .medications-title {
          font-size: 18px;
          font-weight: 600;
          color: #155e75;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid #a5f3fc;
        }
        .medications-table {
          width: 100%;
          border-collapse: collapse;
          text-align: right;
        }
        .medications-table thead {
          background: #ecfeff;
        }
        .medications-table th {
          padding: 8px 12px;
          font-weight: 600;
          color: #155e75;
          font-size: 14px;
          border-bottom: 1px solid #a5f3fc;
        }
        .medications-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .medications-table tbody tr:hover {
          background-color: #f8fafc;
        }
        .instructions-section {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px dashed #cbd5e1;
        }
        .instructions-title {
          font-size: 18px;
          font-weight: 600;
          color: #155e75;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .instructions-content {
          background: #fef9c3;
          border: 1px solid #fef08a;
          border-radius: 6px;
          padding: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #57534e;
        }
        .footer {
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px dashed #cbd5e1;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
        @media print {
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            padding: 0;
          }
          .prescription-container {
            box-shadow: none;
            max-width: none;
            border-radius: 0;
            padding: 0 8px 20px 8px;
            border: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="prescription-container">
        <div class="header">
          <div class="header-top">
            <h1 class="prescription-title">روشتة طبية</h1>
            <div class="prescription-date">${prescriptionData.date || new Date().toLocaleDateString('ar-EG')}</div>
          </div>
          <div class="doctor-info">
            <div>${prescriptionData.doctorName || 'smart clinic'}</div>
            <div>تخصص: ${prescriptionData.specialty || 'استشاري باطنة وأمراض قلب'}</div>
          </div>
        </div>

        <div class="patient-info-section">
          <h3 class="patient-info-title">بيانات المريض</h3>
          <div class="patient-details-grid">
            <div class="patient-detail">
              <span class="patient-detail-label">الاسم:</span>
              ${prescriptionData.patientName || ''}
            </div>
            <div class="patient-detail">
              <span class="patient-detail-label">العمر:</span>
              ${prescriptionData.age || ''}
            </div>
            <div class="patient-detail">
              <span class="patient-detail-label">الجنس:</span>
              ${prescriptionData.gender || ''}
            </div>
            <div class="patient-detail">
              <span class="patient-detail-label">الرقم:</span>
              ${prescriptionData.phone || ''}
            </div>
          </div>
        </div>

        <div class="medications-section">
          <h3 class="medications-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V12.5M10 8H7M10 12H7M10 16H7M14 8H17M14 12H17M14 16H12.5M21.1213 15.1213C21.6839 14.5587 21.6839 13.6587 21.1213 13.0961C20.5587 12.5335 19.6587 12.5335 19.0961 13.0961C18.5335 13.6587 18.5335 14.5587 19.0961 15.1213C19.6587 15.6839 20.5587 15.6839 21.1213 15.1213ZM21.1213 15.1213L16.5 19.7426M14 19.7426H16.5V22.2426" stroke="#155e75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            الأدوية الموصوفة
          </h3>
          <table class="medications-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الدواء</th>
                <th>الجرعة</th>
                <th>المدة</th>
              </tr>
            </thead>
            <tbody>
              ${
                prescriptionData.medications?.length
                  ? prescriptionData.medications.map((med, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${med.name || ''}</td>
                      <td>${med.dosage || ''}</td>
                      <td>${med.duration || ''}</td>
                    </tr>
                  `).join('')
                  : `<tr><td colspan="4" style="text-align:center;">لا توجد أدوية</td></tr>`
              }
            </tbody>
          </table>
        </div>

        <div class="instructions-section">
          <h3 class="instructions-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#155e75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 8V12M12 16H12.01" stroke="#155e75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            تعليمات وإرشادات
          </h3>
          <div class="instructions-content">
            ${prescriptionData.notes || 'يمكن للصيدلي إعطاء البديل - نفس المادة الفعالة التجاري'}
          </div>
        </div>

        <div class="footer">
          شكراً لثقتكم بنا - نتمنى لكم الشفاء العاجل
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            window.close();
          }, 200);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
};