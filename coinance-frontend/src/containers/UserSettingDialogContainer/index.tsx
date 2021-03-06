import React from "react";
import UserSettingDialog from "../../components/UserSettingDialog";
import { inject, observer } from "mobx-react";
import AuthStore from "../../stores/auth";
import UserSettingStore from "../../stores/user-setting";
import LayoutStore from "../../stores/layout";
import OrderStore from "../../stores/order";
import WalletStore from "../../stores/wallet";

interface Props {
  authStore?: AuthStore;
  userSettingStore?: UserSettingStore;
  layoutStore?: LayoutStore;
  orderStore?: OrderStore;
  walletStore?: WalletStore;
}

@inject(
  "authStore",
  "userSettingStore",
  "layoutStore",
  "orderStore",
  "walletStore"
)
@observer
export default class UserSettingDialogContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const authStore = this.props.authStore as AuthStore;
    const layoutStore = this.props.layoutStore as LayoutStore;

    if (!authStore.me?.setting.id && !layoutStore.userSettingDialogOpen) {
      layoutStore.toggleUserSettingDialog();
    }
  }

  private async create() {
    const userSettingStore = this.props.userSettingStore as UserSettingStore;
    const authStore = this.props.authStore as AuthStore;

    const succeed = await userSettingStore.create(authStore.me!.setting);
    if (succeed) {
      const orderStore = this.props.orderStore as OrderStore;
      const walletStore = this.props.walletStore as WalletStore;

      await authStore.verify();
      orderStore.subscribe();
      walletStore.subscribe();
    }
  }

  private async delete() {
    const userSettingStore = this.props.userSettingStore as UserSettingStore;
    const authStore = this.props.authStore as AuthStore;

    const succeed = await userSettingStore.delete(authStore.me!.setting);

    if (succeed) {
      const orderStore = this.props.orderStore as OrderStore;
      const walletStore = this.props.walletStore as WalletStore;

      orderStore.unsubscribe(authStore.me!);
      walletStore.unsubscribe(authStore.me!);
      await authStore.verify();
    }
  }

  render() {
    const userSettingStore = this.props.userSettingStore as UserSettingStore;
    const authStore = this.props.authStore as AuthStore;
    const layoutStore = this.props.layoutStore as LayoutStore;

    return (
      <UserSettingDialog
        status={userSettingStore.status}
        errors={userSettingStore.errors}
        open={layoutStore.userSettingDialogOpen}
        userSetting={authStore.me!.setting}
        onClose={layoutStore.toggleUserSettingDialog}
        onCreate={this.create}
        onDelete={this.delete}
      />
    );
  }
}
