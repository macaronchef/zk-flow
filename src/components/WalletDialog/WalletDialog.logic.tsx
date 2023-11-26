/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { IAppDispatch, IRootState } from '../../redux/store';
import { useCallback } from 'react';
import { setDialog } from '../../redux/reducer/dialogReducer';
import { useForm } from 'react-hook-form';
import { IWallet } from '../../types/Wallet/IWallet';
import { IDialogAction } from '../../types/Dialogs/IDialogAction';
import { toCapitalize } from '../../utils/toCapitalize';
import EditIcon from '../../icons/EditIcon/EditIcon';
import AddIcon from '../../icons/AddIcon/AddIcon';
import { useLocalStorage } from '../../hook/useLocalStorage';

export const useWalletDialog = () => {
  const dispatch = useDispatch<IAppDispatch>();
  const dialog = useSelector((s: IRootState) => s.dialog);
  const { addNewLocalStorage, updateLocalStorage } = useLocalStorage();

  const { handleSubmit, setValue, register } = useForm<IWallet>({
    defaultValues: {
      name: dialog.data?.wallet?.name ?? '',
      adress: dialog.data?.wallet?.adress ?? '',
      blockchain: dialog.data?.wallet?.blockchain ?? [],
    },
  });

  const onSubmit = (data: IWallet) => {
    if (!dialog.data || !dialog.data.action) return;
    if (dialog.data.action === IDialogAction.ADD) addNewLocalStorage(data);
    if (dialog.data.action === IDialogAction.EDIT) updateLocalStorage({ ...data, id: dialog.data.wallet.id });
    handleClose();
  };

  const handleClose = useCallback(() => {
    dispatch(setDialog({ isOpen: undefined, data: undefined }));
  }, []);

  const getDialogTitleName = (): string => toCapitalize(dialog.data.action);

  const getDialogIcon = (): JSX.Element => {
    if (dialog.data.action === IDialogAction.ADD) return <AddIcon />;
    if (dialog.data.action === IDialogAction.EDIT) return <EditIcon />;
    return <></>;
  };

  return {
    handleSubmit,
    onSubmit,
    handleClose,
    setValue,
    register,
    getDialogTitleName,
    getDialogIcon,
    initialDropdownValues: dialog.data?.wallet?.blockchain ?? [],
  };
};
