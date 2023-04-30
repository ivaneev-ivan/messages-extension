import { useEffect, useState } from "react"

import { MessageItem } from "./Message"

export interface IMessageItemList {
  text: string
  id: number
}

export const GeneratedMessageList = () => {
  const [messageList, setMessageList] = useState<IMessageItemList[]>([])
  const [optionList, setOptionList] = useState<IMessageItemList[]>([])
  const [edit, setEdit] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.local.get(
      ["messageList", "optionList"],
      ({ messageList, optionList }) => {
        if (typeof messageList === "object" && typeof optionList === "object") {
          setMessageList(messageList)
          setOptionList(optionList)
        }
      }
    )
  }, [])

  const addMessageToList = () => {
    setMessageList([...messageList, { id: Date.now(), text: "" }])
    chrome.storage.local.set({
      messageList: [...messageList, { id: Date.now(), text: "" }],
    })
  }

  const removeMessageFromList = (messageId: number) => {
    const newMessageList = messageList.filter((m) => m.id != messageId)
    chrome.storage.local.set({ messageList: newMessageList })
    setMessageList(newMessageList)
  }

  const updateMessage = (message: IMessageItemList, updateOptions: boolean) => {
    const newMessageList = [...messageList]
    let i = 0
    while (i < newMessageList.length) {
      if (newMessageList[i].id === message.id) {
        newMessageList[i] = message
        break
      }
      i += 1
    }
    setMessageList(newMessageList)
    chrome.storage.local.set({ messageList: newMessageList })
    if (updateOptions) {
      setOptionList(newMessageList)
      chrome.storage.local.set({ optionList: newMessageList })
    }
  }

  const changeEdit = () => {
    let hasNull = false
    messageList.forEach((message) => {
      if (message.text === "") {
        hasNull = true
      }
    })
    if (hasNull) {
      alert("Сначала введите текст в поле")
    } else if (messageList.length > 0) {
      setEdit(!edit)
    } else {
      alert("Сначала создайте сообщение")
    }
  }

  return (
    <div>
      <div className="description" style={{ marginBottom: "10px" }}>
        отправка сообщений
      </div>
      {messageList.map((message, index) => {
        return (
          <MessageItem
            index={index}
            messageList={optionList}
            id={message.id}
            updateCallback={updateMessage}
            isEdit={edit}
            removeCallback={removeMessageFromList}
            key={message.id}
            text={message.text}
          />
        )
      })}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{ width: "45%" }}
          onClick={() => {
            setEdit(true)
            addMessageToList()
          }}
        >
          Создать
        </button>
        <button
          style={{ width: "45%" }}
          color={edit ? "error" : "primary"}
          onClick={changeEdit}
        >
          {edit ? "Готово" : "Редактировать"}
        </button>
      </div>
    </div>
  )
}
