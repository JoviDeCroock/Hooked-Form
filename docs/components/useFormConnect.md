---
id: useFormConnect
title: UseFormConnect
sidebar_label: UseFormConnect
---

This hook provides you with all relevant form information:

- errors: { [key: string]: error }
- formError?: string | null;
- initialValues: InitialValues
- setFieldValue: (fieldId: string, value: any) => void
- setFieldTouched: (fieldId: string, value: any) => void
- touched: { [key: string]: boolean }
- values: { [key: string]: value }
