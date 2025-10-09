import React from 'react';
import { Helmet } from 'react-helmet';

export const PatientHelmet = () => (
  <Helmet>
    <title>إدارة المرضى - نظام المواعيد الطبية</title>
    <meta
      name="description"
      content="إدارة بيانات المرضى بسهولة وفعالية. عرض، تعديل، وحذف سجلات المرضى مع دعم كامل للغة العربية."
    />
    <meta name="keywords" content="إدارة المرضى, مواعيد طبية, نظام عيادة, سجلات المرضى, برمجيات طبية" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="نظام إدارة العيادات" />
    <meta property="og:title" content="إدارة المرضى - نظام المواعيد الطبية" />
    <meta
      property="og:description"
      content="نظام متقدم لإدارة بيانات المرضى، يتيح عرض وتعديل وحذف سجلات المرضى بسهولة."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={window.location.href} />
    <meta property="og:locale" content="ar_EG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="إدارة المرضى - نظام المواعيد الطبية" />
    <meta name="twitter:description" content="إدارة بيانات المرضى بسهولة وفعالية مع نظام المواعيد الطبية." />
  </Helmet>
);