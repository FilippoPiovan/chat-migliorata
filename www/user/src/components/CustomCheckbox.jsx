import { Checkbox, Chip, cn } from "@nextui-org/react";
import PropTypes from "prop-types";

export const CustomCheckbox = ({ user, value }) => {
  return (
    <Checkbox
      aria-label={user.name}
      classNames={{
        base: cn(
          "flex bg-content1 m-0",
          // "flex flex-row m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between items-center gap-3">
        <p>{user.name}</p>
        {/* <div className="flex flex-col items-end gap-1"> */}
        <Chip
          className="w-[15px] h-[15px]"
          color={user.status === 0 ? "danger" : "success"}
          size="sm"
        ></Chip>
        {/* </div> */}
      </div>
    </Checkbox>
  );
};

CustomCheckbox.propTypes = {
  user: PropTypes.object,
  value: PropTypes.string,
};
