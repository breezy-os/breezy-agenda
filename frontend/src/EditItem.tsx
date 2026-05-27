import { useEffect, useMemo, useState } from "react";

import { isDeadline, isEvent, isGoal, isTask, isValidItem, removeNonessentialFields, switchTypes, useAgendaStore } from "./AgendaState";
import type { AgendaEvent, AgendaItem } from "./AgendaState";
import MultiSwitch from "./components/MultiSwitch";
import * as REST from './rest-calls';


export default function EditItem() {
  const item = useAgendaStore(state => state.itemBeingEdited);
  const { beginItemCreation, updateEditedItem, clearEditedItem, removeItem, addItem } = useAgendaStore(state => state.actions);

  const isValid = useMemo(() => isValidItem(item), [item]);

  const updateItem = (newData: Partial<AgendaItem>) => {
    let finalItem = { ...item, ...newData };
    if ('type' in newData) {
      finalItem = switchTypes(finalItem, newData.type!);
    }
    updateEditedItem(finalItem);
  }

  const [initialItem, setInitialItem] = useState<null | Partial<AgendaItem>>(null);
  useEffect(() => {
    if (item == null) {
      setInitialItem(null);
    } else if (initialItem == null) {
      setInitialItem({...item});
    }
  }, [item]);

  const deleteItem = async () => {
    if (item?.id == null) {
      console.error("Item id was null");
      return;
    }
    try {
      await REST.deleteItem(item.id);
      removeItem(initialItem);
      clearEditedItem();
    } catch (err) {
      // TODO: show an error
      console.error(err);
    }
  }

  const saveChanges = async () => {
    if (isValidItem(item)) {
      const finalItem = removeNonessentialFields(item);
      try {
        await REST.putItem(finalItem);
        removeItem(initialItem);
        addItem(finalItem);
        clearEditedItem();
      } catch (err) {
        // TODO: show an error
        console.error(err);
      }
    }
  }

  return item == null ? (
    <button style={{
      fontSize: '24px',
      height: '50px',
      width: '50px',
      textAlign: 'center',
      position: 'relative'
    }} onClick={() => beginItemCreation()}>
      <span style={{ position: 'absolute', inset: 0, placeSelf: 'center' }}>+</span>
    </button>
  ) : (
    <div className="editItem">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
      }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <span>Text:</span>
            <input type="text" style={{ flex: '1 1' }} onChange={(t) => updateItem({ text: t.target.value })} value={item.text} />
          </label>
        </div>
        <div>
          <MultiSwitch<AgendaItem['type']>
            label="Type"
            currentValue={item.type!}
            setValue={(v) => updateItem({ type: v })}
            options={[
              { value: 'task', text: 'Task' },
              { value: 'event', text: 'Event' },
              { value: 'deadline', text: 'Deadline' },
              { value: 'goal', text: 'Goal' },
            ]} />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          background: 'rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '12px',
          height: '141px',
          boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.4)',
        }}>
          {isTask(item) && (<>
            <div>
              <label>
                <span>Date:</span>
                <input type="date" value={item.date} onChange={(t) => updateItem({ date: t.target.value })} />
              </label>
            </div>
            <div>
              <MultiSwitch<boolean>
                label="Is Complete"
                currentValue={item.isComplete}
                setValue={(v) => updateItem({ isComplete: v })}
                options={[
                  { value: false, text: 'Not yet!' },
                  { value: true, text: 'Yes!' },
                ]} />
            </div>
          </>)}

          {isEvent(item) && (<>
            <div>
              <label>
                <span>Start Date:</span>
                <input type="date" value={item.startDate} onChange={(t) => updateItem({ startDate: t.target.value })} />
              </label>
            </div>
            <div>
              <label>
                <span>End Date:</span>
                <input type="date" value={item.endDate} onChange={(t) => updateItem({ endDate: t.target.value })} />
              </label>
            </div>
            <div>
              <MultiSwitch<AgendaEvent['importance']>
                label="Importance"
                currentValue={item.importance}
                setValue={(v) => updateItem({ importance: v })}
                options={[
                  { value: 'minor', text: 'Minor' },
                  { value: 'major', text: 'Major' },
                ]} />
            </div>
          </>)}

          {isDeadline(item) && (<>
            <div>
              <label>
                <span>Date:</span>
                <input type="date" value={item.dueDate} onChange={(t) => updateItem({ dueDate: t.target.value })} />
              </label>
            </div>
            <div>
              <MultiSwitch<boolean>
                label="Is Complete"
                currentValue={item.isComplete}
                setValue={(v) => updateItem({ isComplete: v })}
                options={[
                  { value: false, text: 'Not yet!' },
                  { value: true, text: 'Yes!' },
                ]} />
            </div>
          </>)}

          {isGoal(item) && (<>
            <div>
              <label>
                <span>Target:</span>
                <input type="date" value={item.dueDate} onChange={(t) => updateItem({ dueDate: t.target.value })} />
              </label>
            </div>
            <div>
              <MultiSwitch<boolean>
                label="Is Complete"
                currentValue={item.isComplete}
                setValue={(v) => updateItem({ isComplete: v })}
                options={[
                  { value: false, text: 'Not yet!' },
                  { value: true, text: 'Yes!' },
                ]} />
            </div>
          </>)}

        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '4px',
        marginTop: '20px',
      }}>
        <button className="ghost danger" onClick={() => deleteItem()}>Delete</button>
        <button className="ghost" onClick={() => clearEditedItem()}>Cancel</button>
        <button className="inset" style={{ flex: '1 1' }} disabled={!isValid} onClick={() => saveChanges()}>Save</button>
      </div>
    </div>
  )
}
