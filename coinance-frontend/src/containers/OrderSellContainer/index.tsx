import React from 'react';
import Order from '../../components/Order';
import { inject, observer } from 'mobx-react';
import OrderStore from '../../stores/order';
import { RouterStore } from 'mobx-react-router';
import CurrencyPairStore from '../../stores/currency-pair';
import { OrderType } from '../../models/order';
import { autorun, IReactionDisposer } from 'mobx';

interface Props {
  routerStore?: RouterStore;
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

interface State {
  useMarketPrice: boolean;
}

@inject('routerStore', 'orderStore', 'currencyPairStore')
@observer
export default class OrderSellContainer extends React.Component<Props, State> {
  useMarketPriceDisposer?: IReactionDisposer;

  state: State = { useMarketPrice: false };

  constructor(props: Props) {
    super(props);
    this.create = this.create.bind(this);
    this.setMaxAmount = this.setMaxAmount.bind(this);
    this.setUseMarketPrice = this.setUseMarketPrice.bind(this);
  }

  componentDidMount() {
    const currencyPairStore = this.props.currencyPairStore!;
    const orderStore = this.props.orderStore!;

    this.useMarketPriceDisposer = autorun(() => {
      if (this.state.useMarketPrice && currencyPairStore.currencyPair) {
        orderStore.sell.form.price = currencyPairStore.currencyPair.exchange_rate.highest_bid;
      }
    });
  }

  componentWillUnmount() {
    if (this.useMarketPriceDisposer) {
      this.useMarketPriceDisposer();
    }
  }

  private async create() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    if (currencyPairStore.currencyPair) {
      orderStore.sell.form.currency_pair = currencyPairStore.currencyPair.id;
      const succeed = await orderStore.createSell();

      if (succeed) {
        orderStore.initializeSellForm(currencyPairStore.currencyPair);
      }
    }
  }

  private setUseMarketPrice(checked: boolean) {
    this.setState({ useMarketPrice: checked });
  }

  private setMaxAmount() {
    console.log('최대 매도량을 누르셨습니당ㅇㅇㅇㅇ');
  }

  render() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    return (
      <Order
        status={orderStore.sell.status}
        errors={orderStore.sell.errors}
        orderType={OrderType.sell}
        currencyPair={currencyPairStore.currencyPair}
        control={orderStore.sell}
        useMarketPrice={this.state.useMarketPrice}
        setUseMarketPrice={this.setUseMarketPrice}
        setMaxAmount={this.setMaxAmount}
        create={this.create}
      />
    );
  }
}