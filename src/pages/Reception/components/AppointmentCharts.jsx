import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

export const AppointmentCharts = ({
  lineChartRef,
  visitTypeChartRef,
  doctorChartRef,
  paymentChartRef,
  getChartData,
  isMobile,
}) => {
  useEffect(() => {
    if (lineChartRef.current && visitTypeChartRef.current && doctorChartRef.current && paymentChartRef.current) {
      const { dailyCounts, completedCounts, pendingCounts, visitTypeCounts, doctorCounts, paymentCounts } =
        getChartData();

      const lineChart = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: Object.keys(dailyCounts),
          datasets: [
            {
              label: 'جميع المواعيد',
              data: Object.values(dailyCounts),
              borderColor: '#0097A7',
              backgroundColor: 'rgba(0, 151, 167, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'المواعيد المكتملة',
              data: Object.values(completedCounts),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'المواعيد في الانتظار',
              data: Object.values(pendingCounts),
              borderColor: '#FFC107',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
          scales: {
            x: {
              title: { display: true, text: 'التاريخ', color: '#333' },
              ticks: { color: '#333' },
            },
            y: {
              title: { display: true, text: 'عدد المواعيد', color: '#333' },
              ticks: { color: '#333' },
              beginAtZero: true,
            },
          },
        },
      });

      const visitTypeChart = new Chart(visitTypeChartRef.current, {
        type: 'pie',
        data: {
          labels: Object.keys(visitTypeCounts).flatMap(type => [`${type} (مدفوع)`, `${type} (غير مدفوع)`]),
          datasets: [
            {
              label: 'عدد المواعيد',
              data: Object.values(visitTypeCounts).flatMap(counts => [counts.paid, counts.unpaid]),
              backgroundColor: ['#00BCD4', '#B2EBF2', '#4DD0E1', '#B2DFDB', '#26A69A', '#80CBC4'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
        },
      });

      const doctorChart = new Chart(doctorChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(doctorCounts),
          datasets: [
            {
              label: 'عدد المواعيد لكل طبيب',
              data: Object.values(doctorCounts),
              backgroundColor: 'rgba(0, 151, 167, 0.6)',
              borderColor: '#0097A7',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
          scales: {
            x: {
              title: { display: true, text: 'الطبيب', color: '#333' },
              ticks: { color: '#333' },
            },
            y: {
              title: { display: true, text: 'عدد المواعيد', color: '#333' },
              ticks: { color: '#333' },
              beginAtZero: true,
            },
          },
        },
      });

      const paymentChart = new Chart(paymentChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['مدفوع', 'غير مدفوع'],
          datasets: [
            {
              label: 'حالة الدفع',
              data: [paymentCounts.paid, paymentCounts.unpaid],
              backgroundColor: ['#4CAF50', '#F44336'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
        },
      });

      return () => {
        lineChart.destroy();
        visitTypeChart.destroy();
        doctorChart.destroy();
        paymentChart.destroy();
      };
    }
  }, [getChartData, isMobile]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4">إحصائيات المواعيد (آخر 7 أيام)</h3>
          <div style={{ height: isMobile ? '250px' : '300px' }}>
            <canvas ref={lineChartRef} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4">توزيع أنواع الزيارات</h3>
          <div style={{ height: isMobile ? '250px' : '300px' }}>
            <canvas ref={visitTypeChartRef} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4">المواعيد حسب الطبيب</h3>
          <div style={{ height: isMobile ? '250px' : '300px' }}>
            <canvas ref={doctorChartRef} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4">حالة الدفع</h3>
          <div style={{ height: isMobile ? '250px' : '300px' }}>
            <canvas ref={paymentChartRef} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
