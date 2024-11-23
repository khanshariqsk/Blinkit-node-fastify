import { ROLES } from "../utils/constant.util.js";

export class AuthDto {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.isActivated = user.isActivated;
    this.role = user.role;

    if (user.role === ROLES.CUSTOMER) {
      this.phone = user.phone;
      this.address = user.address;
      this.liveLocation = user.liveLocation;
    } else if (user.role === ROLES.DELIVERY_PARTNER) {
      this.email = user.email;
      this.phone = user.phone;
      this.address = user.address;
      this.branch = user.branch;
      this.liveLocation = user.liveLocation;
    } else if (user.role === ROLES.ADMIN) {
      this.email = user.email;
    }
  }

  static customerFields =
    "_id name isActivated role phone address liveLocation";

  static deliveryPartnerFields =
    "_id name isActivated role email phone address branch liveLocation";

  static adminFields = "_id name isActivated role email";
}
