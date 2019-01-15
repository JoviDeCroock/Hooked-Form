---
id: why
title: Why
sidebar_label: Why
---

In this chapter I'll elaborate as to why we're opting to make the components
optimised by default.

## Why?

When we logically reason about react and virtual dom it is easy to derive that
when a component tree is deeply nested we are making more expensive calculations,
resulting in sacrificing performance.

Meaning that every component introduces a performance overhad, this is why I've
chosen to make every `Field` automatically optimised.

This implies that it will only rerender when one of your watched props or the value,
touched or error changes.

For the people who want to avoid deeply nesting their component trees, the hooks
are there for you. Since this still is a hooks library I've opted to give you the
building blocks and offer an optimised solution on the side.
