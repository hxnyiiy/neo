from langchain.llms import OpenAI
from langchain.schema import(
    SystemMessage,
    HumanMessage,
    AIMessage
)

chat_llm=ChatOpenAI(
    model = 'gpt-3.5-turbo-instruct',
    temperature = 0.9,
)

message = [
    HumanMessage(content="고양이의 울음소리는?"),
]
print('-' * 50)
print(result)

message_list = [
    [HumanMessage(content="고양이의 울음소리는?")]
    [HumanMessage(content="까마귀 울음소리는?")]
]
print('-'*50)
result = chat_llm.generate(message_list)
print("resultl 0 : ", result.generations[0][0].text)
print("resultl 1 : ", result.generations[1][0].text)
print("llm output : ", result.llm_output)