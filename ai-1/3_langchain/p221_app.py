from langchain.llms import OpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = OpenAI(
    model = 'gpt-3.5-turbo-instruct',
    temperature = 0,
    streaming = True, 
    callbacks = [StreamingStdOutCallbackHandler()],
    verbose = True
)

res = llm("이번에는 토요일에 사전투표가 없다는 가사로 짧은 노래를 만들어줘.")
print(res)