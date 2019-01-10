---
id: get
title: Get
sidebar_label: Get
---

The library also exports a `get` function which given a source to search in (for example `values`) and a fieldId will return the value for that fieldId.
This fieldId can be of any form so for example `friends[0].value` is allowed.

get `(toSearch: object, fieldId: string) => value: any`.

