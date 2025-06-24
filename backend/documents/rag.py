# documents/rag.py

from langchain.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.chat_models import ChatOpenAI

def rag_pipeline(file_path, question, top_k=3):
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    #chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    #vector embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    #RAG chain
    llm = ChatOpenAI(
        base_url="http://192.168.236.230:1234/v1",
        api_key="lm-studio",
        model="llama-2-7b-chat",
        temperature=0.7,
        max_tokens=512
    )

    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)

    result = qa_chain.invoke({"query": question})
    return result
