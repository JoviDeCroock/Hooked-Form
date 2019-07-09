---
id: staticTyping
title: Static Typing
sidebar_label: Static Typing
---

## Form

Form accepts a values generic, this is an object containing
all the values of the field. This will be used to determine what
the `validation` and `submit` will happen with.

Example: `Form<{ name: string }>(options)(Component)`

## Fields

Both `useFieldArrray` and `useField` accept a generic
type to determine what value they'll have and what
they should expect for the onChange to call.

Example: `useField<string>(fieldId)` will make the
value a `string` and make the onChange expect a string.
