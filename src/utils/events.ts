export const appEvents = {
    productsChanged: 'products:changed',
    selectedProductChanged: 'products:selected-changed',
    basketChanged: 'basket:changed',
    buyerChanged: 'buyer:changed',

    cardSelect: 'card:select',
    productToggle: 'product:toggle',
    basketOpen: 'basket:open',
    basketRemove: 'basket:remove',
    basketCheckout: 'basket:checkout',

    orderPaymentChange: 'order:payment-change',
    orderAddressChange: 'order:address-change',
    orderSubmit: 'order:submit',

    contactsEmailChange: 'contacts:email-change',
    contactsPhoneChange: 'contacts:phone-change',
    contactsSubmit: 'contacts:submit',

    modalClose: 'modal:close',
    successClose: 'success:close',
} as const;
