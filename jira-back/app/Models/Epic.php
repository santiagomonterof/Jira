<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Epic extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "description",
        "state_id",
        "project_id",
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }
    public function state()
    {
        return $this->belongsTo(State::class, "state_id");
    }
    public function stories()
    {
        return $this->hasMany(Story::class, "epic_id");
    }

}
