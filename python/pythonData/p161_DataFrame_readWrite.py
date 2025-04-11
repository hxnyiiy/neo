import numpy as np
from pandas import DataFrame

myindex = ['이순신','김유신','강감찬','광해군','연산군']
mycolumns = ['서울','부산','광주','목포','경주']
mylist = list(10 * onedata for onedata in range(1, 26))
print(mylist)

myframe = DataFrame(np.reshape(mylist, (5, 5)), index=myindex, columns=mycolumns)
print(myframe)

print('\n1 row data read of series')
result =myframe.iloc[0]
print(type(result))
print('-' * 50)

print('\nmulti row data read of series')
result =myframe.iloc[1:3]
print(type(result))
print(result)
print('-' * 50)

print('\neven row data read of series')
result =myframe.iloc[0::2]
print(type(result))
print(result)
print('-' * 50)

print('\n김유신 include row dataread of DataFrame')
result =myframe.loc['김유신']
print(type(result))
print(result)
print('-' * 50)

print('\n이순신, 김유신 include row data read of DataFrame')
result =myframe.loc[['이순신', '김유신']]
print(type(result))
print(result)
print('-' * 50)

print(myframe.index)
print('-' * 50)

print('\n이순신, 광주 실적 include row data read of DataFrame')
result =myframe.loc[['이순신'], ['광주']]
print(type(result))
print(result)
print('-' * 50)

print('\n이순신,강감찬의 광주,목포 실적 include row data read of DataFrame')
result =myframe.loc[['이순신', '강감찬'], ['광주', '목포']]
print(type(result))
print(result)
print('-' * 50)