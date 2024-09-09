function increaseQuantity(productId) {
    var quantity = document.getElementById('quantity-' + productId);
    quantity.value = parseInt(quantity.value) + 1;
    updateSubtotal(productId);
}

function decreaseQuantity(productId) {
    var quantity = document.getElementById('quantity-' + productId);
    if (quantity.value > 1) {
        quantity.value = parseInt(quantity.value) - 1;
        updateSubtotal(productId);
    }
}

function updateSubtotal(productId) {
    var quantity = document.getElementById('quantity-' + productId).value;
    var price = parseFloat(document.getElementById('price-' + productId).innerText.replace('$', ''));
    var subtotal = quantity * price;
    document.getElementById('subtotal-' + productId).innerText = '$' + subtotal.toFixed(2);
    updateTotal();
}

function updateTotal() {
    var cartItems = document.getElementsByClassName('cart-item');
    var total = 0;
    for (var item of cartItems) {
        var productId = item.getAttribute('data-product-id');
        var subtotal = parseFloat(document.getElementById('subtotal-' + productId).innerText.replace('$', ''));
        total += subtotal;
    }
    document.getElementById('total').innerText = '$' + total.toFixed(2);
}





$(function() {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 7500,
        values: [340, 7500],
        slide: function(event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));
});


<script>
$(document).ready(function(){
    // Kích hoạt dropdown bằng hover
    $('.dropdown').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
});
</script> 