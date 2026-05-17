import { FormProvider, useForm } from "react-hook-form";
import Input from "../base/input";
import Button from "../base/button";
import { BiSearch } from "react-icons/bi";
import { useEffect } from "react";

/**
 * Search block
 * @example
 * return <SearchBlock />
*/
const SearchBlock: React.FC<{
  onSubmit: (props: {
    search?: string;
  }) => void;
  value?: string;
  disabled?: boolean;
}> = ({
  onSubmit,
  value,
  disabled
}) => {
  const methods = useForm();

  useEffect(() => {
    methods.setValue("search", value);
  }, [ value ]);
  
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit && onSubmit(data))}
        className="flex items-center gap-4"
      >
        <Input
          {...methods.register("search")}
          type="search"
          disabled={disabled}
        />
        <Button
          variant="primary"
          htmlType="submit"
          disabled={disabled}
        >
          <BiSearch />
        </Button>
      </form>
    </FormProvider>
  );
}

export default SearchBlock;