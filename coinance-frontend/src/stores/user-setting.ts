import { boundClass } from "autobind-decorator";
import { observable, action } from "mobx";
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";
import { UserSetting } from "../models/user";
import { userSettingRepository } from "../repositories/user-setting";
import { getAuthToken } from "../utils/token";

@boundClass
export default class UserSettingStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;

  @action
  public async create(userSetting: UserSetting): Promise<boolean> {
    this.status = Status.pending;

    try {
      await userSettingRepository.create(getAuthToken(), userSetting);
      this.errors = undefined;
      this.status = Status.done;

      return true;
    } catch (e) {
      this.errors = e;
      this.status = Status.error;

      return false;
    }
  }

  @action
  public async delete(userSetting: UserSetting): Promise<boolean> {
    this.status = Status.pending;

    try {
      await userSettingRepository.delete(getAuthToken(), userSetting);
      this.errors = undefined;
      this.status = Status.done;

      return true;
    } catch (e) {
      this.errors = e;
      this.status = Status.error;

      return false;
    }
  }
}
