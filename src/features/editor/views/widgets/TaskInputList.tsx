import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { TaskItem } from '../../../calendar/models/entry_model';

interface TaskInputListProps {
  tasks: TaskItem[];
  onChange: (tasks: TaskItem[]) => void;
}

export const TaskInputList: React.FC<TaskInputListProps> = ({ tasks, onChange }) => {
  const [inputText, setInputText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      entry_id: '',
      content: inputText.trim(),
      is_completed: false,
      sort_order: tasks.length,
    };

    onChange([...tasks, newTask]);
    setInputText('');
  };

  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
    );
    onChange(updated);
  };

  const removeTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="modal-section-title">
        <span>Micro-Tasks ({tasks.filter((t) => !!t.is_completed).length}/{tasks.length})</span>
      </div>

      {tasks.length > 0 && (
        <div className="task-list-group">
          {tasks.map((task) => {
            const isDone = !!task.is_completed;
            return (
              <div key={task.id} className="task-item-row">
                <button
                  type="button"
                  className={`task-checkbox ${isDone ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {isDone && <Check size={12} strokeWidth={3} />}
                </button>
                <span className={`task-content-text ${isDone ? 'checked' : ''}`}>
                  {task.content}
                </span>
                <button
                  type="button"
                  className="icon-button"
                  style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: '#8E8E93' }}
                  onClick={() => removeTask(task.id)}
                  title="Remove task"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Input Field */}
      <form onSubmit={handleAddTask} className="task-input-box">
        <input
          type="text"
          placeholder="Add a micro task (e.g. 5km run, coffee session)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="dark-text-input"
        />
        <button
          type="submit"
          className="pill-button"
          style={{ background: 'var(--accent-pill)', color: 'var(--text-primary)' }}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
