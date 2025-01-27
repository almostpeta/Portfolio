import React, { useEffect, useState } from "react";
import { ModalComponent } from "components/Modal/Modal";
import { Button } from "components/Button";
import TaskForm from "containers/Task/Form";

const TaskModal = ({
  onClose,
  show,
  style,
  title,
  onSubmit,
  range,
  onCancel,
  datalists,
}) => {
  const [selectedRange, setSelectedRange] = useState(range);

  useEffect(() => {
    range && setSelectedRange(range);
  }, [range]);

  return (
    <ModalComponent onClose={onClose} show={show} style={style} title={title}>
      <TaskForm
        datalists={datalists}
        initValues={{
          start_date: selectedRange?.start,
          deadline: selectedRange?.end,
        }}
        onSubmit={onSubmit}
        onCancel={onClose}
        fromScreen="Calendar"
      />
    </ModalComponent>
  );
};

export default TaskModal;
