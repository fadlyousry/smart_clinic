import React from 'react';
import { Helmet } from 'react-helmet';

export const AppointmentHelmet = () => (
  <Helmet>
    <title>إدارة المواعيد - نظام المواعيد الطبية</title>
    <meta
      name="description"
      content="إدارة المواعيد الطبية بسهولة وفعالية. عرض، تعديل، وحذف المواعيد مع دعم كامل للغة العربية."
    />
    <meta name="keywords" content="إدارة المواعيد, مواعيد طبية, نظام عيادة, برمجيات طبية" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="نظام إدارة العيادات" />
    <meta property="og:title" content="إدارة المواعيد - نظام المواعيد الطبية" />
    <meta
      property="og:description"
      content="نظام متقدم لإدارة المواعيد الطبية، يتيح عرض وتعديل وحذف المواعيد بسهولة."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={window.location.href} />
    <meta property="og:locale" content="ar_EG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="إدارة المواعيد - نظام المواعيد الطبية" />
    <meta name="twitter:description" content="إدارة المواعيد الطبية بسهولة وفعالية مع نظام المواعيد الطبية." />
  </Helmet>
);
