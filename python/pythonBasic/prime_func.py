#!/usr/bin/env python

a=int(input("Input number(0 : quit) :"))

def prime(n):
    for k in range(2,n+1):
        if n % k == 0:
            break
        if k == n:
            return 1
        else:
            return 0