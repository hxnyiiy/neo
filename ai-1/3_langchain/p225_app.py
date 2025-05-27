from langchain.prompts import PromptTemplate

jinja2_prompt = PromptTemplate(
    input_variables = ["items"],
    template_format = "jinja2",
    template ="""
    {% for item in items %}
    Q : {{ item.question }}
    A : {{ item.answer }}
    {% endfor %}
    """
)

items = [
    {"question" : "foo", "answer" : "bar"},
    {"question" : "1", "answer" : "2"},
]

print(jinja2_prompt.format(items=items))