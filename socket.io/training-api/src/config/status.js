const paymentStatus = 
{
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED:'Refunded'
};

const orderStatus = 
{
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    DISPATCHED: 'Dispatched',
    CANCELLED: 'Cancelled',
    DELIVERED: 'Delivered'
}
  
module.exports = 
{
    paymentStatus,
    orderStatus
};
  