import lmstudio as lms 

model=lms.llm()
result = model.respond('What is the meanin of life?')

print(result)