import { useEffect, useState } from "react"
import { nextKey } from "./consts"
import { MessageItem } from "./MessageItem"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

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

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(messageList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setMessageList(items)
    chrome.storage.local.set({ messageList: items })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="messageList">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {messageList.map((message, index) => (
              <Draggable
                key={message.id}
                draggableId={message.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <MessageItem
                      index={index}
                      messageList={optionList}
                      id={message.id}
                      updateCallback={updateMessage}
                      isEdit={edit}
                      removeCallback={removeMessageFromList}
                      text={message.text}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="w-5/12 text-black font-medium"
          onClick={() => {
            if (messageList.length != nextKey.length) {
              setEdit(true)
              addMessageToList()
            }
          }}
        >
          Создать
        </button>
        <button onClick={changeEdit} className="w-5/12 text-black font-medium">
          {edit ? "Готово" : "Редактировать"}
        </button>
      </div>
    </DragDropContext>
  )
}
