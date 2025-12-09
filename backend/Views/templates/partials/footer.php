</div>
  <!-- Footer -->
  <footer class="w3-container w3-padding-16 w3-black">
    <h4>Koketsu Store</h4>
    <p>© 2025 Koketsu. Desenvolvido com <a href="https://www.w3schools.com/w3css/" target="_blank" class="w3-text-theme">W3.CSS</a></p>
  </footer>

</div>

<script>
var mySidebar = document.getElementById("mySidebar");
var overlayBg = document.getElementById("myOverlay");

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
</script>

</body>
</html>