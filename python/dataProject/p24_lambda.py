#!/usr/bin/env python

i = input("Enter a number : ")
j = input("Enter a number : ")

a = lambda i, j : i + j
print(f'{i} + {j} = {a(int(i), int(j))}')


