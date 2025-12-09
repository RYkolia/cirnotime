// 自定义图片区域功能
document.addEventListener('DOMContentLoaded', function() {
    const customImageUploadBtn = document.getElementById('custom-image-upload-btn');
    const customImageInput = document.getElementById('custom-image-input');
    const customImageContent = document.getElementById('custom-image-content');
    
    // 点击上传按钮触发文件选择
    customImageUploadBtn.addEventListener('click', function() {
        customImageInput.click();
    });
    
    // 点击内容区域触发文件选择
    customImageContent.addEventListener('click', function(e) {
        if (e.target === customImageContent || e.target.classList.contains('custom-image-placeholder')) {
            customImageInput.click();
        }
    });
    
    // 处理文件选择
    customImageInput.addEventListener('change', function(e) {
        handleImageFiles(e.target.files);
        // 清空输入框，允许重复选择相同文件
        e.target.value = '';
    });
    
    // 拖拽上传功能
    customImageContent.addEventListener('dragover', function(e) {
        e.preventDefault();
        customImageContent.classList.add('drag-over');
    });
    
    customImageContent.addEventListener('dragleave', function() {
        customImageContent.classList.remove('drag-over');
    });
    
    customImageContent.addEventListener('drop', function(e) {
        e.preventDefault();
        customImageContent.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleImageFiles(e.dataTransfer.files);
        }
    });
    
    // 处理图片文件
    function handleImageFiles(files) {
        const placeholder = customImageContent.querySelector('.custom-image-placeholder');
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const imageItem = document.createElement('div');
                    imageItem.className = 'custom-image-item';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = '用户上传的图片';
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        imageItem.remove();
                        
                        // 如果没有图片了，显示占位符
                        if (!customImageContent.querySelector('.custom-image-item')) {
                            if (placeholder) {
                                placeholder.style.display = 'block';
                            }
                        }
                    });
                    
                    imageItem.appendChild(img);
                    imageItem.appendChild(deleteBtn);
                    customImageContent.appendChild(imageItem);
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('请上传图片文件！');
            }
        });
    }
    
    // 从本地存储加载保存的图片
    loadSavedImages();
    
    function loadSavedImages() {
        // 这里可以添加从localStorage加载保存图片的逻辑
        // 示例：如果有保存的图片数据，可以在这里恢复
    }
});