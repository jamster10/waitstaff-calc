'use strict';
/* global $*/

//Based on given info, there isnt a need to track every meal, just running totals
//As such meal details do not need to be stored.

//above is what I thought initially, should customer charges be put in the state?
//technically it would be a source of truth for everything on the page
//but is that necessary?


const STORE = {
  earnings: {
    tipTotal: 0,
    mealCount: 0,
  },
  charges:{
    subtotal: 0,
    tip: 0,
  },
};

$(manageCalculator());

function manageCalculator(){
  renderCalc();
  addNewMeal();
  reset();
}

function renderCalc(){
  const values = pullDataAndCalculate(STORE);

  $('.js-tip-total').text(values.tipTotal);
  $('.js-meal-count').text(values.mealCount);
  $('.js-avg').text(values.avgTip);
  $('.js-subtotal').text(values.subtotal);
  $('.js-tip').text(values.tip);
  $('.js-total').text(values.total);

}

function pullDataAndCalculate (store) {
  const {tipTotal, mealCount} = store.earnings;
  const {subtotal, tip} = store.charges;
  const avgTip = tipTotal === 0 ? 0 : (tipTotal / mealCount).toFixed(2);
  const total = (subtotal + tip).toFixed(2);
 
  return { tipTotal, mealCount, avgTip, subtotal, tip, total };
}

function addNewMeal (){
  $('form').on('submit', function(e){
    e.preventDefault();
    const baseMeal = +$('#meal-price').val();
    const taxRate = +$('#tax-rate').val();
    const tipPercentage = +$('#tip-percentage').val();

  
    calculateCharges(baseMeal, taxRate, tipPercentage);

    $('#meal-price').val('');
    $('#tax-rate').val('');
    $('#tip-percentage').val('');
  });
}

function calculateCharges(baseMeal, taxRate, tipPercentage){
  const tipValue = +(baseMeal * tipPercentage / 100).toFixed(2);
  const taxValue = +(baseMeal * taxRate / 100).toFixed(2);
  const subTotal = +(baseMeal + taxValue);
  updateState(tipValue, subTotal);
}

function updateState (tipAddendum, subTotal){
  STORE.earnings.mealCount++;
  STORE.earnings.tipTotal += Number(tipAddendum.toFixed(2));
  STORE.charges.subtotal = Number(subTotal.toFixed(2));
  STORE.charges.tip = Number(tipAddendum.toFixed(2)); 
  renderCalc();
}

function reset (){
  $('.reset-btn').on('click', function(){
    const defaultSTORE = {
      earnings: {
        tipTotal: 0,
        mealCount: 0,
      },
      charges:{
        subtotal: 0,
        tip: 0,
      },
    };
    Object.assign(STORE, defaultSTORE);
    renderCalc();
  });
}


